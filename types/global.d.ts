export {};

declare global {
  var __verifiedEmails: Map<string, boolean> | undefined;
  var __verifyTokens: Map<string, string> | undefined;
}