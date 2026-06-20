import type { ProjectSettingsAddressRow } from "@/features/settings/project-settings.service";

export interface AutomationContractOption {
  address: string;
  chain: string;
  name: string;
}

export const resolveContractCatalog = (
  savedContracts: ProjectSettingsAddressRow[] | undefined,
  fallbackContracts: AutomationContractOption[]
): AutomationContractOption[] => {
  if (Array.isArray(savedContracts) && savedContracts.length > 0) {
    return savedContracts
      .filter(
        (contract): contract is ProjectSettingsAddressRow =>
          typeof contract.address === "string" &&
          contract.address.trim().length > 0
      )
      .map((contract) => {
        const chain = contract.chain?.trim() ?? "";
        const name = contract.label?.trim() ?? "";
        return {
          address: contract.address,
          chain: chain.length > 0 ? chain : "Unknown",
          name: name.length > 0 ? name : contract.address,
        };
      });
  }

  return fallbackContracts;
};

export const buildTriggerContractPatch = (
  selectedAddress: string,
  contractCatalog: AutomationContractOption[]
) => {
  const next = contractCatalog.find(
    (contract) => contract.address === selectedAddress
  );

  return {
    contract: next?.name ?? selectedAddress,
    contractAddress: selectedAddress,
    chain: next?.chain ?? "",
  };
};
