export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
}) {
  const baseStyles = "flex items-center cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900";
  const outlineStyles = "border border-yellow-50 bg-transparent";
  const filledStyles = "bg-yellow-50";

  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type}
      className={`${baseStyles} ${outline ? outlineStyles : filledStyles} ${customClasses}`}
    >
      {children ? (
        <>
          <span className={outline ? "text-yellow-50" : ""}>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}
