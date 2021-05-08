export function normalizePath(path: string, originEnd = false): string {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  if (!originEnd && !path.endsWith('/')) {
    path = `${path}/`;
  }
  return path;
}

export function joinPath(pre: string, post: string, originEnd = false): string {
  pre = normalizePath(pre);

  if (post.startsWith('/')) {
    post = post.substring(1);
  }

  if (!originEnd && !post.endsWith('/')) {
    post = `${post}/`;
  }

  return pre + post;
}
