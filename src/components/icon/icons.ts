import type { IconType } from "react-icons";
import {
  RiAddLine,
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpSLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCircleFill,
  RiCircleLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiExternalLinkLine,
  RiInboxLine,
  RiInformationLine,
  RiLoader4Line,
  RiLock2Line,
  RiMoreLine,
  RiQuestionLine,
  RiRadioButtonLine,
  RiRecordCircleLine,
  RiSearchLine,
  RiStarFill,
  RiStarHalfLine,
  RiStarLine,
  RiSubtractLine,
  RiTimeLine,
  RiUploadCloud2Line,
} from "react-icons/ri";

/** Semantic icon slots used by Duality components. */
export interface DualityIcons {
  close: IconType;
  check: IconType;
  dash: IconType;
  add: IconType;
  radioOn: IconType;
  chevronDown: IconType;
  chevronUp: IconType;
  chevronLeft: IconType;
  chevronRight: IconType;
  firstPage: IconType;
  lastPage: IconType;
  sortNone: IconType;
  sortAsc: IconType;
  sortDesc: IconType;
  star: IconType;
  starHalf: IconType;
  starFilled: IconType;
  lock: IconType;
  calendar: IconType;
  clock: IconType;
  search: IconType;
  more: IconType;
  spinner: IconType;
  deltaUp: IconType;
  deltaDown: IconType;
  deltaNeutral: IconType;
  toneInfo: IconType;
  toneSuccess: IconType;
  toneWarning: IconType;
  toneError: IconType;
  stepComplete: IconType;
  markerComplete: IconType;
  markerCurrent: IconType;
  markerBlank: IconType;
  dot: IconType;
  empty: IconType;
  avatarFallback: IconType;
  upload: IconType;
  externalLink: IconType;
}

/** Built-in Remix (`ri`) line icons. Override via `IconsProvider`. */
export const defaultIcons: DualityIcons = {
  close: RiCloseLine,
  check: RiCheckLine,
  dash: RiSubtractLine,
  add: RiAddLine,
  radioOn: RiRadioButtonLine,
  chevronDown: RiArrowDownSLine,
  chevronUp: RiArrowUpSLine,
  chevronLeft: RiArrowLeftSLine,
  chevronRight: RiArrowRightSLine,
  firstPage: RiArrowLeftDoubleLine,
  lastPage: RiArrowRightDoubleLine,
  sortNone: RiArrowUpDownLine,
  sortAsc: RiArrowUpSLine,
  sortDesc: RiArrowDownSLine,
  star: RiStarLine,
  starHalf: RiStarHalfLine,
  starFilled: RiStarFill,
  lock: RiLock2Line,
  calendar: RiCalendarLine,
  clock: RiTimeLine,
  search: RiSearchLine,
  more: RiMoreLine,
  spinner: RiLoader4Line,
  deltaUp: RiArrowUpSLine,
  deltaDown: RiArrowDownSLine,
  deltaNeutral: RiSubtractLine,
  toneInfo: RiInformationLine,
  toneSuccess: RiCheckboxCircleLine,
  toneWarning: RiAlertLine,
  toneError: RiErrorWarningLine,
  stepComplete: RiCheckLine,
  markerComplete: RiCheckboxCircleLine,
  markerCurrent: RiRecordCircleLine,
  markerBlank: RiCircleLine,
  // A status/selection dot is filled by definition, so it keeps the fill glyph
  // even though the rest of the set uses line variants.
  dot: RiCircleFill,
  empty: RiInboxLine,
  avatarFallback: RiQuestionLine,
  upload: RiUploadCloud2Line,
  externalLink: RiExternalLinkLine,
};
