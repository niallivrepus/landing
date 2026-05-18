import arrowLongRightIcon from "../assets/lordicon/filled/arrow-long-right.json";
import domainVerificationIcon from "../assets/lordicon/filled/domain-verification.json";
import downloadSaveIcon from "../assets/lordicon/filled/download-save.json";
import chatEmptyIcon from "../assets/lordicon/filled/chat-empty.json";
import logSignInIcon from "../assets/lordicon/filled/log-sign-in.json";
import newspaperIcon from "../assets/lordicon/filled/newspaper.json";
import plusIcon from "../assets/lordicon/filled/plus.json";
import searchIcon from "../assets/lordicon/filled/search.json";
import workIcon from "../assets/lordicon/filled/work.json";
import worldGlobeWikisIcon from "../assets/lordicon/filled/world-globe-wikis.json";

export const lordiconAssets = {
  arrowLongRight: arrowLongRightIcon,
  chatEmpty: chatEmptyIcon,
  domainVerification: domainVerificationIcon,
  downloadSave: downloadSaveIcon,
  logSignIn: logSignInIcon,
  newspaper: newspaperIcon,
  plus: plusIcon,
  search: searchIcon,
  work: workIcon,
  worldGlobeWikis: worldGlobeWikisIcon,
} as const;

export type GooeyLordiconAssetName = keyof typeof lordiconAssets;
