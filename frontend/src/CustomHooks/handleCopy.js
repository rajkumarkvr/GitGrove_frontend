const handleCopy = (text, setCopied) => {
  if (window.navigator.clipboard) {
    navigator.clipboard.writeText(text);
    setCopied(true);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setCopied(false);
      console.error("Fallback copy failed: ", err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
};

export default handleCopy;
