// Google Identity Services
interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface IdConfiguration {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GsiButtonConfiguration {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  width?: number;
}

interface Google {
  accounts: {
    id: {
      initialize(config: IdConfiguration): void;
      renderButton(parent: HTMLElement, options: GsiButtonConfiguration): void;
      prompt(): void;
      cancel(): void;
    };
  };
}

declare global {
  interface Window {
    google?: Google;
    onGoogleLibraryLoad?: () => void;
  }
}

// Apple Sign In
interface AppleSignInAuthorizationResponse {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    email?: string;
    name?: { firstName?: string; lastName?: string };
  };
}

interface AppleSignInClientConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  nonce?: string;
  state?: string;
  usePopup?: boolean;
}

interface AppleID {
  auth: {
    init(config: AppleSignInClientConfig): void;
    signIn(config?: Partial<AppleSignInClientConfig>): Promise<AppleSignInAuthorizationResponse>;
  };
}

declare global {
  interface Window {
    AppleID?: AppleID;
  }
}

export {};
