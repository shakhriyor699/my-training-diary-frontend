import { CreateUserDialog } from "./create-user-dialog";
import type { RoleOption } from "../lib/admin-roles.types";

type UsersTableHeaderProps = {
  canCreate: boolean;
  roleOptions: RoleOption[];
  labels: {
    title: string;
    description: string;
    create: {
      trigger: string;
      title: string;
      description: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      password: string;
      passwordPlaceholder: string;
      role: string;
      submit: string;
      submitting: string;
      cancel: string;
      fallbackRole: string;
      errorFallback: string;
      success: string;
    };
  };
};

export function UsersTableHeader({
  canCreate,
  roleOptions,
  labels,
}: UsersTableHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-[32px] font-semibold text-white">{labels.title}</h2>
        <p className="mt-1 text-lg text-white/42">{labels.description}</p>
      </div>
      {canCreate ? (
        <CreateUserDialog roleOptions={roleOptions} labels={labels.create} />
      ) : null}
    </div>
  );
}
