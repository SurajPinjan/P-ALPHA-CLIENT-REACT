import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box } from '@mui/material';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const [editorValue, setEditorValue] = useState(value);

    useEffect(() => {
        if (value !== editorValue) {
            setEditorValue(value);
        }
    }, [value, editorValue]);

    const handleEditorChange = (content: string) => {
        setEditorValue(content);
        onChange(content);
    };

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];

    return (
        <Box sx={{ marginTop: 2 }}>
            <ReactQuill
                theme="snow"
                value={editorValue}
                onChange={handleEditorChange}
                modules={modules}
                formats={formats}
            />
        </Box>
    );
};

export default RichTextEditor;