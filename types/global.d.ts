export {};

declare module "*.css";
declare module "*.scss";
declare module "react-datepicker/dist/react-datepicker.css";

declare global {
  var __verifiedEmails: Map<string, boolean> | undefined;
  var __verifyTokens: Map<string, string> | undefined;
}