

import { useState } from "react";
import Tesseract from "tesseract.js";

export default function OCRDemo() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const imageUrl = URL.createObjectURL(file);

        const { data } = await Tesseract.recognize(imageUrl, "eng", {
            logger: (m) => console.log(m), // progress logging
        });

        setText(data.text);
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {loading && <p className="mt-2">⏳ Processing OCR...</p>}
            {text && (
                <div className="mt-4 p-2 border rounded bg-gray-100">
                    <p className="font-semibold">Extracted Text:</p>
                    <pre>{text}</pre>
                </div>
            )}
        </div>
    );
}
