import * as React from 'react';
import classNames from 'classnames';

import { ShuttleContext } from './ShuttleContext';
import { NUMBER_OF_CONTAINERS, SHUTTLE_CONTAINERS_ARRAY } from './globals';
import { ShuttleState } from './Shuttle';

let id_int = 0; // eslint-disable-line @typescript-eslint/camelcase

export interface ShuttleContainerProps {
    /**
     * Child render function of the Shuttle Container.
     * This is where you render your Shuttle.Item components.
     */
    children: (
        store: ShuttleState,
        getItemProps: (
            index: number
        ) => {
            'data-index': number;
            selected: boolean;
        }
    ) => React.ReactNode;

    /**
     * Optionally pass a className to the container
     * for CSS styles.
     */
    className?: string;

    [key: string]: any;
}

/**
 * Pass a child render function or a render prop.
 */
export const ShuttleContainer: React.FunctionComponent<ShuttleContainerProps> = React.memo(
    // eslint-disable-next-line react/display-name
    React.forwardRef<HTMLDivElement, ShuttleContainerProps>(
        ({ children, className, ...rest }, ref) => {
            const { shuttleState } = React.useContext(ShuttleContext);

            // mod needed for HMR updates
            const id = React.useRef(
                SHUTTLE_CONTAINERS_ARRAY[Math.floor(id_int++ % NUMBER_OF_CONTAINERS)] // eslint-disable-line @typescript-eslint/camelcase
            );

            /**
             * Pass the props to the item as you render it.
             * This is important to include since it contains
             * optimizations for click events on the shuttle
             * item.
             */
            const getItemProps = React.useCallback(
                (index: number) => {
                    return {
                        'data-index': index,
                        selected: shuttleState.selected[id.current].has(index),
                    };
                },
                [shuttleState]
            );

            return (
                <div
                    className={classNames('shuttle__container', className)}
                    role="listbox"
                    {...rest}
                    data-name={id.current}
                    ref={ref}
                    tabIndex={0}>
                    {children(shuttleState, getItemProps)}
                </div>
            );
        }
    )
);

ShuttleContainer.displayName = 'Shuttle.Container';
