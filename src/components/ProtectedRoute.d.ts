declare const ProtectedRoute: React.ComponentType<{
  children: React.ReactNode;
  requiredRole: string;
}>;
export default ProtectedRoute;