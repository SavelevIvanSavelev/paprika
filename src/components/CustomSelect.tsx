import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IoChevronDown } from 'react-icons/io5';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 24px;
  font-size: 16px;
  background-color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.value ? '#333' : '#999'};
  font-family: 'HamburgSerial', sans-serif;

  svg {
    transition: transform 0.2s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.2s ease;
  z-index: 1000;
`;

const Option = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.$isSelected ? '#00ADE6' : 'white'};
  color: ${props => props.$isSelected ? 'white' : '#333'};
  border: none;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  font-family: 'HamburgSerial', sans-serif;

  &:hover {
    background: ${props => props.$isSelected ? '#00ADE6' : '#f5f5f5'};
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecteer een antwoord',
  disabled = false
}) => {
  const [$isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton
        type="button"
        onClick={() => !disabled && setIsOpen(!$isOpen)}
        $isOpen={$isOpen}
        disabled={disabled}
        value={value}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <IoChevronDown />
      </SelectButton>
      <DropdownList $isOpen={$isOpen}>
        {options.map((option) => (
          <Option
            key={option.value}
            onClick={() => handleSelect(option.value)}
            $isSelected={option.value === value}
          >
            {option.label}
          </Option>
        ))}
      </DropdownList>
    </SelectContainer>
  );
};

export default CustomSelect; 