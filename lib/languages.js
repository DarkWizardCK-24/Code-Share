import {
  SiJavascript, SiTypescript, SiDart, SiRust, SiGo,
  SiKotlin, SiSwift, SiPhp, SiRuby, SiCplusplus,
  SiHtml5, SiCss3, SiMysql, SiMarkdown, SiGnubash, SiFlutter, SiPython,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import { BiCodeCurly } from "react-icons/bi";
import { TbBrandCSharp } from "react-icons/tb";
import { AiOutlineFileText } from "react-icons/ai";

export const LANGUAGES = [
  { id: "javascript", label: "JavaScript",  ext: "js",    icon: SiJavascript,     color: "#F7DF1E" },
  { id: "typescript", label: "TypeScript",  ext: "ts",    icon: SiTypescript,     color: "#3178C6" },
  { id: "jsx",        label: "JSX / React", ext: "jsx",   icon: SiJavascript,     color: "#61DAFB" },
  { id: "tsx",        label: "TSX / React", ext: "tsx",   icon: SiTypescript,     color: "#61DAFB" },
  { id: "python",     label: "Python",      ext: "py",    icon: SiPython,         color: "#3572A5" },
  { id: "dart",       label: "Dart",        ext: "dart",  icon: SiDart,           color: "#00B4AB" },
  { id: "flutter",    label: "Flutter",     ext: "dart",  icon: SiFlutter,        color: "#54C5F8" },
  { id: "rust",       label: "Rust",        ext: "rs",    icon: SiRust,           color: "#DEA584" },
  { id: "go",         label: "Go",          ext: "go",    icon: SiGo,             color: "#00ADD8" },
  { id: "java",       label: "Java",        ext: "java",  icon: DiJava,           color: "#B07219" },
  { id: "kotlin",     label: "Kotlin",      ext: "kt",    icon: SiKotlin,         color: "#A97BFF" },
  { id: "swift",      label: "Swift",       ext: "swift", icon: SiSwift,          color: "#FA7343" },
  { id: "cpp",        label: "C++",         ext: "cpp",   icon: SiCplusplus,      color: "#F34B7D" },
  { id: "csharp",     label: "C#",          ext: "cs",    icon: TbBrandCSharp,    color: "#9B4F96" },
  { id: "php",        label: "PHP",         ext: "php",   icon: SiPhp,            color: "#777BB4" },
  { id: "ruby",       label: "Ruby",        ext: "rb",    icon: SiRuby,           color: "#CC342D" },
  { id: "html",       label: "HTML",        ext: "html",  icon: SiHtml5,          color: "#E34F26" },
  { id: "css",        label: "CSS",         ext: "css",   icon: SiCss3,           color: "#1572B6" },
  { id: "sql",        label: "SQL",         ext: "sql",   icon: SiMysql,          color: "#4479A1" },
  { id: "bash",       label: "Bash",        ext: "sh",    icon: SiGnubash,        color: "#4EAA25" },
  { id: "json",       label: "JSON",        ext: "json",  icon: BiCodeCurly,      color: "#CBB45A" },
  { id: "yaml",       label: "YAML",        ext: "yaml",  icon: AiOutlineFileText,color: "#CB171E" },
  { id: "markdown",   label: "Markdown",    ext: "md",    icon: SiMarkdown,       color: "#083FA1" },
  { id: "plaintext",  label: "Plain Text",  ext: "txt",   icon: AiOutlineFileText,color: "#8B949E" },
];

export const LANG_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));

/** Map internal IDs to highlight.js language strings */
export function toHljsLang(id) {
  const map = { jsx: "javascript", tsx: "typescript", flutter: "dart" };
  return map[id] ?? id;
}
