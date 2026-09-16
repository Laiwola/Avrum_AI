import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getFieldPasses, listFields, refreshImagery } from "@/lib/satellite/service";

export function useFields() {
  return useQuery({
    queryKey: ["fields"],
    queryFn: listFields,
  });
}

export function useFieldPasses(fieldId: string | undefined) {
  return useQuery({
    queryKey: ["satellite-passes", fieldId],
    queryFn: () => getFieldPasses(fieldId!),
    enabled: Boolean(fieldId),
  });
}

export function useRefreshImagery(fieldId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => refreshImagery(fieldId!),
    onSuccess: () => {
      if (fieldId) {
        void queryClient.invalidateQueries({ queryKey: ["satellite-passes", fieldId] });
      }
    },
  });
}
