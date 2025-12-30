// Transform plugin to handle import.meta.env in Jest
const transformImportMetaEnv = () => {
    return {
        visitor: {
            MemberExpression(path) {
                const node = path.node;
                // Match import.meta.env.VARIABLE_NAME
                if (
                    node.object?.type === 'MemberExpression' &&
                    node.object.object?.type === 'MetaProperty' &&
                    node.object.object.meta?.name === 'import' &&
                    node.object.object.property?.name === 'meta' &&
                    node.object.property?.name === 'env' &&
                    node.property?.name
                ) {
                    // Transform import.meta.env.VITE_API_URL to undefined (will use fallback)
                    path.replaceWithSourceString('undefined');
                }
            },
        },
    };
};

export default {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: [
        '@babel/plugin-syntax-import-meta',
        transformImportMetaEnv,
    ],
};

