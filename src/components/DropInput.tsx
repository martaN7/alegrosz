import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

function DropInput() {
    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out',
    };

    const focusedStyle = {
        borderColor: '#2196f3',
    };

    const acceptStyle = {
        borderColor: '#00e676',
    };

    const rejectStyle = {
        borderColor: '#ff1744',
    };

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({ accept: { 'image/*': [] } });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    return (
        <section className="container">
            {/*//TODO generate typing for all css attrs*/}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/*@ts-ignore*/}
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
            </aside>
        </section>
    );
}

export default DropInput;
