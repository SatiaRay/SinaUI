
export const copyToClipboard = async (text, options = {}) => {
  const { useFallback = true } = options;

  if (!text) return false;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Clipboard API failed:", err);
      if (!useFallback) return false;
    }
  }

  if (useFallback) {
    return fallbackCopyTextToClipboard(text);
  }

  return false;
};
const fallbackCopyTextToClipboard = (text) => {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
};
