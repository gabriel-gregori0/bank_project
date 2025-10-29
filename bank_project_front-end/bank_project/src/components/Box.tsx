import React, { ElementType, ReactNode, CSSProperties } from 'react';

interface StyleSheet extends CSSProperties {
   fontFamily?: string;
}

interface BoxProps  {
    styleSheet?: StyleSheet;
    children?: ReactNode;
    tag?: string;
};

export default function Box({ styleSheet, children, tag}: BoxProps) {
    const Tag = tag as ElementType;
    return (
        <Tag style={styleSheet}>
            {children}
        </Tag>
    );
}