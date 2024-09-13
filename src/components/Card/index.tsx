interface ICard {
    id: number;
    body: string;
    onChange?: (id: number, answer: string) => void;
    selectedAnswer?: string;
}

export default function Card({ id, body, onChange, selectedAnswer }: ICard) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(id, e.target.value)
    }

    return (
        <div id={`${id}`} className="bg-card rounded-lg shadow-md p-4 max-w-lg">
            <p className="text-card-foreground">{`${id}. ${body}`}</p>
            <div>
                <label htmlFor="yes" className="text-card-foreground mx-1">Sim</label>
                <input type="radio" id={`yes`} name={`answer-${id}`} value={'yes'} className="p-2 mt-4"
                    onChange={handleInputChange}
                    checked={selectedAnswer === 'yes'}
                />
            </div>
            <div>
                <label htmlFor="no" className="text-card-foreground mx-1">Não</label>
                <input type="radio" id={`no`} name={`answer-${id}`} value={'no'} className="p-2 mt-4"
                    onChange={handleInputChange}
                    checked={selectedAnswer === 'no'}
                />
            </div>
        </div>
    )
}