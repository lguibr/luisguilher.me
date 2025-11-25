import { Monaco } from '@monaco-editor/react'

export const defineMonacoThemes = (monaco: Monaco) => {
    monaco.editor.defineTheme('modern-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'ff79c6' },
            { token: 'string', foreground: 'f1fa8c' },
            { token: 'number', foreground: 'bd93f9' },
            { token: 'type', foreground: '8be9fd' },
            { token: 'class', foreground: '8be9fd' },
            { token: 'function', foreground: '50fa7b' },
            { token: 'variable', foreground: 'f8f8f2' },
            { token: 'operator', foreground: 'ff79c6' },
            { token: 'delimiter', foreground: 'f8f8f2' }
        ],
        colors: {
            'editor.background': '#00000000', // Transparent to show gradient
            'editor.foreground': '#f8f8f2',
            'editor.lineHighlightBackground': '#44475a50',
            'editor.selectionBackground': '#44475a',
            'editorCursor.foreground': '#00F5FF', // Cyan accent
            'editorWhitespace.foreground': '#6272a4',
            'editorIndentGuide.background': '#6272a4',
            'editorLineNumber.foreground': '#6272a4',
            'editorLineNumber.activeForeground': '#f8f8f2',
            'editor.selectionHighlightBackground': '#424450',
            'scrollbarSlider.background': '#6272a450',
            'scrollbarSlider.hoverBackground': '#6272a4',
            'scrollbarSlider.activeBackground': '#6272a4',
            'widget.shadow': '#00000050'
        }
    })

    monaco.editor.defineTheme('modern-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#00000000', // Transparent
            'editorCursor.foreground': '#667eea', // Purple accent
            'editorLineNumber.foreground': '#A0AEC0',
            'editorLineNumber.activeForeground': '#2D3748'
        }
    })
}
