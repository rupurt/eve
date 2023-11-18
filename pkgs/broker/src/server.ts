interface Server {
  listen(): Promise<string>;
  close(): Promise<void>;
}

enum ServerType {
  HTTP = 'http',
}

export { Server, ServerType };
