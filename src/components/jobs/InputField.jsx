import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function InputField({
    tags = [],
    setTags,
    placeholder = "Add and press Enter",
}) {
    const [value, setValue] = useState("");

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        if (tags.includes(trimmed)) return;
        setTags([...tags, trimmed]);
        setValue("");
    };

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(value);
        } else if (e.key === "Backspace" && !value && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    return (
        <div className="w-full">
            {/* Tags section */}
            <div className="flex gap-2 flex-wrap">
                {tags.map((t, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-1 max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem] bg-[#2c2c2c] text-white rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm truncate"
                        title={t}
                    >
                        <span className="truncate">{t}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(t)}
                            className="ml-1 text-red-400 hover:text-red-600"
                        >
                            <FaTimes size={12} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Input box */}
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="input input-bordered border-black w-full mt-2 bg-gray-200 text-black text-sm sm:text-base"
            />
        </div>
    );
}
