import { memo, ReactNode } from 'react';
import cn from 'classnames';
import styles from './PageControl.module.scss';

interface PageControlProps {
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    isArrow?: boolean;
    children: ReactNode;
}

export const PageControl = memo(({
    className, children, isActive, onClick, disabled, isArrow,
}: PageControlProps) => {
    const clickHandler = () => {
        if (disabled) return;
        onClick?.();
    };
    const mods = {
        [styles.active]: isActive,
        [styles.disabled]: disabled,
        [styles.isArrow]: isArrow,
    };

    return (
        <button onClick={clickHandler} className={cn(styles.root, mods, className)}>
            {children}
        </button>
    );
});
