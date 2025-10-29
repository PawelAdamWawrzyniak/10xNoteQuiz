import { siGithub } from "simple-icons";

interface GithubIconProps {
  className?: string;
}

export const GithubIcon = ({ className = "h-5 w-5" }: GithubIconProps) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-label="GitHub"
    >
      <title>GitHub</title>
      <path d={siGithub.path} />
    </svg>
  );
};
