interface FileData {
    id: string,
    name: string,
    size: string,
    type: string,
    uploadDate: string,
    downloadURL: string
}
type LoadingStatus = 'idle' | 'loading' | 'error';

interface FilesState {
    files: {
        entities: Record<number, FileData>,
        filesLoadingStatus: LoadingStatus
    }
}

export type { FileData, FilesState };