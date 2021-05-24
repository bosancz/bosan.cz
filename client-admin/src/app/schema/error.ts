export interface ErrorData {
  message: string;
  status: number;
  description: string;
  stack: string;
  url: string;
  navigator: string;
  ng: {
    component: string;
    environment: string;
  };
};