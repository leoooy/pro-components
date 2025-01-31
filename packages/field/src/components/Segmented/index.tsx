import { Segmented, Spin } from 'antd';
import React, { useImperativeHandle, useRef } from 'react';
import type { ProFieldFC } from '../../index';
import { FieldSelectProps, ObjToMap, proFieldParsingText, useFieldFetchData } from '../Select';

/**
 * Segmented https://ant.design/components/segmented-cn/
 *
 * @param
 */
const FieldSegmented: ProFieldFC<
  {
    text: string;
    emptyText?: React.ReactNode;
  } & FieldSelectProps
> = ({ mode, render, renderFormItem, fieldProps, emptyText = '-', ...rest }, ref) => {
  const inputRef = useRef<HTMLInputElement>();

  const [loading, options, fetchData] = useFieldFetchData(rest);

  useImperativeHandle(ref, () => ({
    ...(inputRef.current || {}),
    fetchData: () => fetchData(),
  }));

  if (loading) {
    return <Spin size="small" />;
  }

  if (mode === 'read') {
    const optionsValueEnum = options?.length
      ? options?.reduce((pre: any, cur) => {
          return { ...pre, [cur.value ?? '']: cur.label };
        }, {})
      : undefined;

    const dom = <>{proFieldParsingText(rest.text, ObjToMap(rest.valueEnum || optionsValueEnum))}</>;

    if (render) {
      return render(rest.text, { mode, ...fieldProps }, <>{dom}</>) ?? emptyText;
    }
    return dom;
  }
  if (mode === 'edit' || mode === 'update') {
    const dom = <Segmented ref={inputRef} allowClear {...fieldProps} options={options} />;

    if (renderFormItem) {
      return renderFormItem(rest.text, { mode, ...fieldProps, options }, dom);
    }
    return dom;
  }
  return null;
};

export default React.forwardRef(FieldSegmented);
