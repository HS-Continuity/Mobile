import toast from "react-hot-toast";

const CustomToast = ({
  message,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  confirmClass = "bg-white text-black hover:bg-gray-100",
  cancelClass = "bg-red-500 text-white hover:bg-red-600",
}) => {
  return (
    <div className='flex w-72 flex-col'>
      <p className='mb-4 text-center'>{message}</p>
      <div className='flex w-full'>
        <button
          className={`btn flex-1 rounded-lg px-4 py-2 ${confirmClass}`}
          onClick={() => {
            onConfirm();
            toast.dismiss();
          }}>
          {confirmText}
        </button>
        <button
          className={`btn flex-1 rounded-lg px-4 py-2 ${cancelClass}`}
          onClick={() => {
            onCancel();
            toast.dismiss();
          }}>
          {cancelText}
        </button>
      </div>
    </div>
  );
};

export const showCustomToast = ({
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmClass,
  cancelClass,
  duration = 2000,
}) => {
  toast(
    t => (
      <CustomToast
        message={message}
        onConfirm={() => {
          onConfirm();
          toast.dismiss(t.id);
        }}
        onCancel={() => {
          onCancel();
          toast.dismiss(t.id);
        }}
        confirmText={confirmText}
        cancelText={cancelText}
        confirmClass={confirmClass}
        cancelClass={cancelClass}
      />
    ),
    {
      duration,
      style: {
        background: "white",
        color: "#1F2937",
        border: "1px solid #d60000",
        padding: "16px",
        borderRadius: "8px",
      },
    }
  );
};
