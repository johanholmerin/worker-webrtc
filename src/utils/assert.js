export default function (val, error) {
  if (val) return;
  if (error instanceof Error) throw error;
  throw new Error(error);
}
