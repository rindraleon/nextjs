import Button from "@/components/ui/button/Button";

interface ActionButtonsProps {
  onAddManual: () => void;
  onAddSpecialized: () => void;
}

export const ActionButtons = ({ onAddManual, onAddSpecialized }: ActionButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onAddManual} className="flex items-center gap-2">
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 4.5C9.41421 4.5 9.75 4.83579 9.75 5.25V8.25H12.75C13.1642 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.1642 9.75 12.75 9.75H9.75V12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75V9.75H5.25C4.83579 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.83579 8.25 5.25 8.25H8.25V5.25C8.25 4.83579 8.58579 4.5 9 4.5Z"
            fill=""
          />
        </svg>
        Repas global
      </Button>

      <Button onClick={onAddSpecialized} className="flex items-center gap-2">
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 4.5C9.41421 4.5 9.75 4.83579 9.75 5.25V8.25H12.75C13.1642 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.1642 9.75 12.75 9.75H9.75V12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75V9.75H5.25C4.83579 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.83579 8.25 5.25 8.25H8.25V5.25C8.25 4.83579 8.58579 4.5 9 4.5Z"
            fill=""
          />
        </svg>
        Repas Spécialisé
      </Button>
    </div>
  );
};