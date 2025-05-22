import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function InputBar({ value, onChange }) {
    return (_jsxs("div", { className: "input-bar", children: [_jsx("input", { type: "text", placeholder: "Zoek of stel een vraag", value: value, onChange: e => onChange(e.target.value) }), _jsx("button", { className: "plus-btn", children: "+" })] }));
}
