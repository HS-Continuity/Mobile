import React, { useState, useEffect } from "react";

const DeliveryMemo = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [customMemo, setCustomMemo] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const options = [
    { value: "", label: "선택 안함" },
    { value: "문 앞에 놓아주세요", label: "문 앞에 놓아주세요" },
    { value: "부재 시 연락 부탁드려요", label: "부재 시 연락 부탁드려요" },
    { value: "배송 전 미리 연락해주세요", label: "배송 전 미리 연락해주세요" },
    { value: "custom", label: "직접 입력하기" },
  ];

  useEffect(() => {
    if (selectedOption === "custom") {
      onChange(customMemo);
    } else {
      onChange(selectedOption);
    }
  }, [selectedOption, customMemo, onChange]);

  const handleSelectChange = e => {
    const value = e.target.value;
    setSelectedOption(value);
    setShowCustomInput(value === "custom");
    if (value !== "custom") {
      setCustomMemo("");
    }
  };

  const handleCustomMemoChange = e => {
    const value = e.target.value;
    if (value.length <= 50) {
      setCustomMemo(value);
    }
  };

  return (
    <div className='rounded-lg border bg-white p-4'>
      <h2 className='mb-2 text-xl font-semibold'>배송 메모</h2>
      <hr className='mb-3 border-gray-200' />
      <div className='space-y-2'>
        <div>
          <span className='inline-block w-24 font-light text-gray-500'>메모 선택</span>
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className='ml-2 rounded border border-gray-300 px-2 py-1'>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {showCustomInput && (
          <div>
            <span className='inline-block w-24 font-light text-gray-500'>직접 입력</span>
            <input
              type='text'
              value={customMemo}
              onChange={handleCustomMemoChange}
              placeholder='배송 메모를 입력해주세요 (최대 50자)'
              maxLength={50}
              className='ml-2 rounded border border-gray-300 px-2 py-1'
            />
            <p className='mt-1 text-right text-sm text-gray-500'>{customMemo.length}/50자</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryMemo;
