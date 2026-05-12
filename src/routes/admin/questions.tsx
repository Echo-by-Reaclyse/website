import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { AdminQuestion, AdminCategory } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/questions")({
  component: QuestionsPage,
});

// ── Form types ────────────────────────────────────────────────────────────────

interface QuestionFormValues {
  text: string;
  category_id: string;
  is_active: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function groupByCategory(questions: AdminQuestion[]): Map<string, AdminQuestion[]> {
  const map = new Map<string, AdminQuestion[]>();
  for (const q of questions) {
    const key = q.category_name;
    const bucket = map.get(key) ?? [];
    bucket.push(q);
    map.set(key, bucket);
  }
  for (const bucket of map.values()) {
    bucket.sort((a, b) => a.sort_order - b.sort_order);
  }
  return map;
}

// ── Page ──────────────────────────────────────────────────────────────────────

function QuestionsPage() {
  const qc = useQueryClient();

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminQuestion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminQuestion | null>(null);

  // ── Queries ──────────────────────────────────────────────────────────────

  const questionsQuery = useQuery({
    queryKey: ["admin", "questions"],
    queryFn: () => adminApi.getQuestions(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminApi.getCategories(),
  });

  // ── Mutations ────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data: QuestionFormValues) =>
      adminApi.createQuestion({
        text: data.text,
        category_id: data.category_id,
        is_active: data.is_active,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "questions"] });
      setAddOpen(false);
      toast.success("Question created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuestionFormValues }) =>
      adminApi.updateQuestion(id, {
        text: data.text,
        category_id: data.category_id,
        is_active: data.is_active,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "questions"] });
      setEditTarget(null);
      toast.success("Question updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteQuestion(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "questions"] });
      setDeleteTarget(null);
      toast.success("Question deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminApi.updateQuestion(id, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "questions"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: adminApi.reorderQuestions,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "questions"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Reorder ───────────────────────────────────────────────────────────────

  function moveQuestion(question: AdminQuestion, direction: "up" | "down") {
    const questions = questionsQuery.data ?? [];
    const peers = questions
      .filter((q) => q.category_id === question.category_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const idx = peers.findIndex((q) => q.id === question.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= peers.length) return;

    const peer = peers[swapIdx];
    reorderMutation.mutate([
      { id: question.id, sort_order: peer.sort_order },
      { id: peer.id, sort_order: question.sort_order },
    ]);
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const questions = questionsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const categoryNames = Array.from(new Set(questions.map((q) => q.category_name)));

  const filteredQuestions =
    filterCategory === "all"
      ? questions
      : questions.filter((q) => q.category_name === filterCategory);

  const grouped = groupByCategory(filteredQuestions);

  // ── Loading / error ───────────────────────────────────────────────────────

  if (questionsQuery.isLoading) {
    return (
      <PageShell title="Questions">
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading questions…
        </div>
      </PageShell>
    );
  }

  if (questionsQuery.isError) {
    return (
      <PageShell title="Questions">
        <ErrorState message={(questionsQuery.error as Error).message} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Questions"
      action={
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Question
        </Button>
      }
    >
      {/* ── Category filter tabs ───────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <FilterTab
          label={`All (${questions.length})`}
          active={filterCategory === "all"}
          onClick={() => setFilterCategory("all")}
        />
        {categoryNames.map((name) => {
          const count = questions.filter((q) => q.category_name === name).length;
          return (
            <FilterTab
              key={name}
              label={`${name} (${count})`}
              active={filterCategory === name}
              onClick={() => setFilterCategory(name)}
            />
          );
        })}
      </div>

      {/* ── Grouped tables ────────────────────────────────────────────── */}
      {grouped.size === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          No questions found. Add one above.
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([categoryName, qs]) => (
            <div key={categoryName}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {categoryName}
              </h3>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Order</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qs.map((q, i) => (
                      <TableRow key={q.id}>
                        {/* Order */}
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            <button
                              className="rounded p-1 hover:bg-accent disabled:opacity-30"
                              disabled={i === 0 || reorderMutation.isPending}
                              onClick={() => moveQuestion(q, "up")}
                              aria-label="Move up"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="rounded p-1 hover:bg-accent disabled:opacity-30"
                              disabled={i === qs.length - 1 || reorderMutation.isPending}
                              onClick={() => moveQuestion(q, "down")}
                              aria-label="Move down"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </TableCell>

                        {/* Text */}
                        <TableCell className="max-w-md">
                          <p className="line-clamp-2 text-sm leading-relaxed">{q.text}</p>
                        </TableCell>

                        {/* Active */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={q.is_active}
                              onCheckedChange={(checked) =>
                                toggleMutation.mutate({ id: q.id, is_active: checked })
                              }
                              disabled={toggleMutation.isPending}
                            />
                            <Badge variant={q.is_active ? "default" : "secondary"}>
                              {q.is_active ? "Active" : "Off"}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditTarget(q)}
                              aria-label="Edit question"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(q)}
                              aria-label="Delete question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add dialog ─────────────────────────────────────────────────── */}
      <QuestionDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        categories={categories}
        title="Add Question"
        description="Create a new reflection question."
        onSubmit={(values) => createMutation.mutate(values)}
        isPending={createMutation.isPending}
      />

      {/* ── Edit dialog ────────────────────────────────────────────────── */}
      {editTarget && (
        <QuestionDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          categories={categories}
          title="Edit Question"
          description="Update this reflection question."
          defaultValues={{
            text: editTarget.text,
            category_id: editTarget.category_id,
            is_active: editTarget.is_active,
          }}
          onSubmit={(values) =>
            updateMutation.mutate({ id: editTarget.id, data: values })
          }
          isPending={updateMutation.isPending}
        />
      )}

      {/* ── Delete confirmation ────────────────────────────────────────── */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete question?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The question will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTarget && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground line-clamp-3">
              "{deleteTarget.text}"
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}

// ── QuestionDialog ─────────────────────────────────────────────────────────────

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: AdminCategory[];
  title: string;
  description: string;
  defaultValues?: QuestionFormValues;
  onSubmit: (values: QuestionFormValues) => void;
  isPending: boolean;
}

function QuestionDialog({
  open,
  onOpenChange,
  categories,
  title,
  description,
  defaultValues,
  onSubmit,
  isPending,
}: QuestionDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    defaultValues: defaultValues ?? {
      text: "",
      category_id: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");
  const categoryId = watch("category_id");

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Text */}
          <div className="space-y-1.5">
            <Label htmlFor="q-text">Question text</Label>
            <Textarea
              id="q-text"
              rows={3}
              placeholder="What does this moment mean to you?"
              {...register("text", {
                required: "Question text is required",
                minLength: { value: 5, message: "Question must be at least 5 characters" },
              })}
              aria-invalid={errors.text ? "true" : "false"}
            />
            {errors.text && (
              <p className="text-xs text-destructive">{errors.text.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="q-category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={(val) =>
                setValue("category_id", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="q-category">
                <SelectValue placeholder="Select a category…" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Hidden input to register category_id for RHF */}
            <input
              type="hidden"
              {...register("category_id", { required: "Please select a category" })}
            />
            {errors.category_id && (
              <p className="text-xs text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <Label htmlFor="q-active" className="cursor-pointer">
              Active
            </Label>
            <Switch
              id="q-active"
              checked={isActive}
              onCheckedChange={(val) => setValue("is_active", val)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function PageShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  );
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      {message}
    </div>
  );
}
