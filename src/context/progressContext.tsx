import { createContext, ReactNode, useContext, useState } from "react";

interface ContextProgress {
    progress: number,
    setProgress: React.Dispatch<React.SetStateAction<number>>
}

const ProgressContext = createContext<ContextProgress>({
    progress: 0,
    setProgress: () => {}
})

const useProgressContext = () => useContext(ProgressContext);

const ProgressProvider = ({ children }: { children: ReactNode }) => {
    const [progress, setProgress] = useState(0);

    return (
        <ProgressContext.Provider value={{progress, setProgress}}>
            {children}
        </ProgressContext.Provider>
    )
}

export {ProgressProvider, useProgressContext};