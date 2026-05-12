import React, { useState, useEffect } from "react";
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
import type { AdminCategory } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

// ── Form types ────────────────────────────────────────────────────────────────

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

// ── Page ──────────────────────────────────────────────────────────────────────

function CategoriesPage() {
  const qc = useQueryClient();

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  // ── Query ─────────────────────────────────────────────────────────────────

  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => adminApi.getCategories(),
  });

  // ── Mutations ─────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormValues) =>
      adminApi.createCategory({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        is_active: data.is_active,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      void qc.invalidateQueries({ queryKey: ["admin", "questions"] });
      setAddOpen(false);
      toast.success("Category created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormValues }) =>
      adminApi.updateCategory(id, {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        is_active: data.is_active,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      void qc.invalidateQueries({ queryKey: ["admin", "questions"] });
      setEditTarget(null);
      toast.success("Category updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      void qc.invalidateQueries({ queryKey: ["admin", "questions"] });
      setDeleteTarget(null);
      toast.success("Category deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminApi.updateCategory(id, { is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const reorderMutation = useMutation({
    mutationFn: adminApi.reorderCategories,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "categories"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Reorder ───────────────────────────────────────────────────────────────

  function moveCategory(category: AdminCategory, direction: "up" | "down") {
    const sorted = [...(categoriesQuery.data ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    );
    const idx = sorted.findIndex((c) => c.id === category.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const peer = sorted[swapIdx];
    reorderMutation.mutate([
      { id: category.id, sort_order: peer.sort_order },
      { id: peer.id, sort_order: category.sort_order },
    ]);
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const categories = [...(categoriesQuery.data ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  // ── Loading / error ───────────────────────────────────────────────────────

  if (categoriesQuery.isLoading) {
    return (
      <PageShell title="Categories">
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading categories…
        </div>
      </PageShell>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <PageShell title="Categories">
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {(categoriesQuery.error as Error).message}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Categories"
      action={
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Category
        </Button>
      }
    >
      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          No categories yet. Add one above.
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Slug</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat, i) => (
                <TableRow key={cat.id}>
                  {/* Order */}
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <button
                        className="rounded p-1 hover:bg-accent disabled:opacity-30"
                        disabled={i === 0 || reorderMutation.isPending}
                        onClick={() => moveCategory(cat, "up")}
                        aria-label="Move up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded p-1 hover:bg-accent disabled:opacity-30"
                        disabled={i === categories.length - 1 || reorderMutation.isPending}
                        onClick={() => moveCategory(cat, "down")}
                        aria-label="Move down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <span className="font-medium">{cat.name}</span>
                  </TableCell>

                  {/* Slug */}
                  <TableCell className="hidden md:table-cell">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                      {cat.slug}
                    </code>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="hidden lg:table-cell max-w-xs">
                    {cat.description ? (
                      <span className="line-clamp-1 text-sm text-muted-foreground">
                        {cat.description}
                      </span>
                    ) : (
                      <span className="text-sm italic text-muted-foreground/50">—</span>
                    )}
                  </TableCell>

                  {/* Active */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cat.is_active}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({ id: cat.id, is_active: checked })
                        }
                        disabled={toggleMutation.isPending}
                      />
                      <Badge variant={cat.is_active ? "default" : "secondary"}>
                        {cat.is_active ? "Active" : "Off"}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditTarget(cat)}
                        aria-label="Edit category"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(cat)}
                        aria-label="Delete category"
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
      )}

      {/* ── Add dialog ─────────────────────────────────────────────────── */}
      <CategoryDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Category"
        description="Create a new question category."
        onSubmit={(values) => createMutation.mutate(values)}
        isPending={createMutation.isPending}
      />

      {/* ── Edit dialog ────────────────────────────────────────────────── */}
      {editTarget && (
        <CategoryDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          title="Edit Category"
          description="Update this category's details."
          defaultValues={{
            name: editTarget.name,
            slug: editTarget.slug,
            description: editTarget.description ?? "",
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
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All questions in this category may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteTarget && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
              "{deleteTarget.name}"
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

// ── CategoryDialog ────────────────────────────────────────────────────────────

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  defaultValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => void;
  isPending: boolean;
}

function CategoryDialog({
  open,
  onOpenChange,
  title,
  description,
  defaultValues,
  onSubmit,
  isPending,
}: CategoryDialogProps) {
  const isEditing = defaultValues !== undefined;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      description: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");
  const name = watch("name");

  // Auto-derive slug from name when creating (not editing)
  useEffect(() => {
    if (isEditing) return;
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setValue("slug", autoSlug);
  }, [name, isEditing, setValue]);

  function handleClose(openState: boolean) {
    if (!openState) reset();
    onOpenChange(openState);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              placeholder="Identity"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-slug">Slug</Label>
            <Input
              id="cat-slug"
              placeholder="identity"
              {...register("slug", {
                required: "Slug is required",
                minLength: { value: 2, message: "Slug must be at least 2 characters" },
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message:
                    "Slug may only contain lowercase letters, numbers, and hyphens",
                },
              })}
              aria-invalid={errors.slug ? "true" : "false"}
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="cat-desc"
              rows={2}
              placeholder="Questions about who you are and how you see yourself."
              {...register("description")}
            />
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <Label htmlFor="cat-active" className="cursor-pointer">
              Active
            </Label>
            <Switch
              id="cat-active"
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

// ── PageShell ─────────────────────────────────────────────────────────────────

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
