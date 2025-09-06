import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

export default function InputField({ tags, setTags, placeholder = "Add tag and press Enter" }) {
    const [value, setValue] = useState("");

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        if (tags.includes(trimmed)) {
            toast.info("Tag already added");
            return;
        }
        setTags([...tags, trimmed]);
        setValue("");
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
        <div>
            <div className="flex gap-2 flex-wrap">
                {tags.map((t, i) => (
                    <span key={i} className="badge badge-outline flex items-center gap-2">
                        {t}
                        <button
                            type="button"
                            onClick={() => setTags(tags.filter((x) => x !== t))}
                            className="btn btn-xs btn-ghost p-0 ml-2"
                            aria-label={`remove ${t}`}
                        >
                            <FaTimes />
                        </button>
                    </span>
                ))}
            </div>
            <input
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="input input-bordered input-sm w-full mt-2"
            />
            <p className="text-xs text-gray-400 mt-1">Press Enter to add tag</p>
        </div>
    );
}
