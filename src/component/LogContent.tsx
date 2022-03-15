import React, { useCallback, useEffect } from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowRenderer,
} from 'react-virtualized';
import { Partical } from '../matcher';
import RawLogger from './RawLogger';
import { ErrorMatcher } from '../errorMatcher';

import styles from '../style/log.module.less';

export interface LogContent {
  virtual?: boolean;
  particals: Partical[];
  style?: React.CSSProperties;
  linkify?: boolean;
  errorMatcher: ErrorMatcher;
  autoScroll?: boolean;
  useClasses?: boolean;
}

const measurementCache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 25,
});

export function VirtualLogContent({
  particals,
  style,
  linkify,
  errorMatcher,
  autoScroll,
  useClasses
}: LogContent) {
  const rowRenderer: ListRowRenderer = useCallback(
    ({ key, index, style, parent }) => {
      const partical = particals[index];
      return (
        <CellMeasurer
          cache={measurementCache}
          columnIndex={0}
          rowIndex={index}
          key={key}
          parent={parent}
        >
          <RawLogger
            partical={partical}
            key={`logger-line-${index}`}
            foldable={partical.type === 'partical'}
            index={index}
            linkify={linkify}
            errorMatcher={errorMatcher}
            useClasses={useClasses}
            style={style}
          />
        </CellMeasurer>
      );
    },
    [particals, linkify, errorMatcher],
  );

  return (
    <pre id="log" className={styles.ansi} style={style}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            rowCount={particals.length}
            rowRenderer={rowRenderer}
            width={width}
            height={height}
            deferredMeasurementCache={measurementCache}
            rowHeight={measurementCache.rowHeight}
            overscanRowCount={10}
            scrollToAlignment={autoScroll ? 'end' : 'auto'}
          />
        )}
      </AutoSizer>
    </pre>
  );
}

export function ClassicLogContent({ particals, style, linkify, errorMatcher, useClasses }: LogContent) {
  return (
    <pre id="log" className={styles.ansi} style={style}>
      {particals.map((partical, index) => {
        return (
          <RawLogger
            key={`logger-line-${index}`}
            foldable={partical.type === 'partical'}
            partical={partical}
            index={index}
            linkify={linkify}
            errorMatcher={errorMatcher}
            useClasses={useClasses}
          />
        );
      })}
    </pre>
  );
}

export default function LogContent(props: LogContent) {
  if (props.virtual) {
    return <VirtualLogContent {...props} />;
  }

  return <ClassicLogContent {...props} />;
}
