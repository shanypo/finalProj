import { Droppable } from 'react-beautiful-dnd';
import { CardPreview } from './CardPreview.jsx'

export function CardList({ cards, list, onUpdateBoard, board, currListIdx }) {
    if (!cards) return <> </>
    return (
        <section className="all-cards">
            <Droppable droppableId={list.listId} type="card">
                {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {cards.map((card, index) => (
                            <CardPreview key={card.cardId} board={board} currListIdx={currListIdx} list={list} currCardIdx={index} card={card} onUpdateBoard={onUpdateBoard} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </section>
    )
}