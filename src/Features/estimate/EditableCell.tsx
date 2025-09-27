import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EditableCellProps {
    value: string | number;
    onChange: (value: string) => void;
    type?: 'text' | 'number';
    placeholder?: string;
    className?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
    value,
    onChange,
    type = 'text',
    placeholder = '',
    className = '',
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value.toString());

    useEffect(() => {
        setEditValue(value.toString());
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        onChange(editValue);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            onChange(editValue);
        } else if (e.key === 'Escape') {
            setEditValue(value.toString());
            setIsEditing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
        onChange(e.target.value); // real-time update
    };

    if (isEditing) {
        return (
            <Input
                type='number'
                min='0' // ✅ prevents negatives in browser input
                value={editValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyUp={handleKeyUp}
            />
        );
    }

    return (
        <div
            className={`flex items-center gap-3 px-3 py-2 rounded ${className}`}>
            <span className='truncate'>{value || placeholder}</span>
            <Pencil
                size={14}
                className='cursor-pointer text-muted-foreground hover:text-foreground'
                onClick={() => setIsEditing(true)}
            />
        </div>
    );
};

export default EditableCell;
