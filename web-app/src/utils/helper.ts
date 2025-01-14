import { StreamID } from "@ceramicnetwork/streamid";
import moment from "moment";

export function copyToClipboard(str?: string) {
  if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(str || "");
  } else {
    const temp = document.createElement("input");
    const newStyle: Partial<CSSStyleDeclaration> = {
      position: "absolute",
      left: "-5000px",
      top: "-5000px",
    };

    Object.assign(temp.style, {
      newStyle,
    });
    temp.value = str || "";
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  }
}

export function generateRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 50%, 50%)`;
}

export function isSSR() {
  return !(
    typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
  );
}

export function maskAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}
export function maskDID(did: string) {
  const address = did.split(":").pop();
  return maskAddress(address!);
}

export function isMobile() {
  return (
    !isSSR() &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  );
}

export const isValidContractAddress = (contractAddress: string) => {
  const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressPattern.test(contractAddress);
};
export const setDates = <
  T extends { updatedAt?: string; createdAt?: string; [key: string]: any },
>(
  obj: T,
  update: boolean = false,
) => {
  const date = moment.utc().toISOString();
  if (update === false) {
    obj.createdAt = date;
  }
  obj.updatedAt = date;
  return obj;
};

export const switchNetwork = async (chainId: string) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
    return true;
  } catch (e: any) {
    if (e.code === 4001) return false; // Reject to switch
  }
};
export const getCurrentDateTime = () => moment.utc().toISOString();

const isValidUrl = (url: string) => {
  try {
    const testURL = new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export const filterValidUrls = (urls: string[]) => urls.filter(isValidUrl);

export const removeDuplicates = (arr1: string[], arr2?: string[]) => {
  if (!arr2 || arr2.length === 0) {
    return arr1.filter((value, index) => arr1.indexOf(value) === index);
  }
  return arr1.filter((item) => !arr2.includes(item));
};

export const shuffleArray = (array: any[]) => {
  const shuffled = array.sort(() => Math.random() - 0.5);
  return shuffled;
};

export const isStreamID = (value: string) => {
  try {
    StreamID.fromString(value).toString();
    return true;
  } catch (e) {
    return false;
  }
};

export const shortStr = (str: string, maxLen: number = 80) => {
  if (str.length > maxLen) {
    return `${str.substring(0, maxLen)}...`;
  }

  return str;
};
