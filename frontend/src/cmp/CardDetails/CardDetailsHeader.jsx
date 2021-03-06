import { DynamicPopover } from '../DynamicPopover';
import close from '../../assets/imgs/close.svg';

export function CardDetailsHeader({ board, currListIdx, currCardIdx, handleClose }) {
    const currCard = board.lists[currListIdx].cards[currCardIdx]
    const coverMode = currCard.cardStyle.id ? 'cover-mode ' + currCard.cardStyle.color : '';
    const coverStyle = currCard.cardStyle.img ? 'img-cover ' + 'cover-mode' : coverMode;

    return (
        <div className={coverStyle} style={{ backgroundImage: `url(${currCard.cardStyle.img})` }}>
            <div className="close-window-btn pointer flex align-center justify-center" onClick={handleClose}><img src={close} alt="close" /></div>
            {coverMode && <div className={`cover-menu pointer`} >
                <DynamicPopover type={'cover'} title={'Cover'} titleModal={'Cover'}
                    board={board}
                    currListIdx={currListIdx}
                    currCardIdx={currCardIdx}
                />
            </div>}
        </div>
    )
}