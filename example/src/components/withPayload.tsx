import React from "react";

interface WithPayloadProps {
    targetEndpoint: string;
    targetEndpoints?: string[];
}

function withPayload<T extends WithPayloadProps>(Component: React.ComponentType<T>) {
    return function WrappedComponent(props: Omit<T, "disabled">) {
        const disabled = !props.targetEndpoint && (!props.targetEndpoints || props.targetEndpoints.length === 0);

        return <Component {...(props as T)} disabled={disabled} />;
    };
}

export default withPayload;
