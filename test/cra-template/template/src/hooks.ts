import { useCallback, useEffect, useRef, useState } from 'react';

export function useDeployCodeSandbox() {
  const [pending, setPending] = useState(false);
  const deployCodeSandbox = useCallback(async () => {
    setPending(true);
    try {
      const { uri } = await (await fetch('/codesandbox')).json();
      window.open(uri, '_blank');
    } catch (error) {
      console.error(error);
    }
    setPending(false);
  }, []);
  return [pending, deployCodeSandbox] as [boolean, () => void];
}

export interface GitInfo {
  branch: string,
  tag: string,
  changes: {
    type: string,
    path: string
  }[]
}

export function useGitInfo() {
  const [info, setInfo] = useState<GitInfo | null>(null);
  const update = useCallback(() => {
    fetch('/git')
      .then(res => res.json())
      .then(setInfo)
      .catch(() => {
        try {
          setInfo(require('./git.json'));
        } catch (error) {

        }
      });
  }, []);
  useEffect(() => {
    update();
    const t = setInterval(update, 5000);
    return () => clearInterval(t);
  }, [update]);
  return info;
}

export function openIDE() {
  return fetch('/open-ide');
}


const STORAGE_KEY = 'fabric:react-sandbox:footer';

export function useShowFooter() {
  const [showFooter, setShowFooter] = useState(localStorage.getItem(STORAGE_KEY) || require('./git.json') !== null ? 0 : -1);
  useEffect(() => {
    showFooter === -1 && setShowFooter(1);
  }, [showFooter]);
  useEffect(() => {
    showFooter > -1 && localStorage.setItem(STORAGE_KEY, 'true');
  }, [showFooter]);
  return [showFooter, setShowFooter] as [number, React.Dispatch<number>];
}