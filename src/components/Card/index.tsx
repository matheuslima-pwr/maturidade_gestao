interface ICard {
    id: number;
    body: string;
    onChange?: (id: number, answer: string) => void;
    selectedAnswer?: string;
    border?: string;
}

export default function Card({ id, body, onChange, selectedAnswer, border }: ICard) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(id, e.target.value)
    }

    return (
        <div id={`${id}`} className={`bg-card rounded-lg shadow-md p-4 max-w-lg ${border}`}>
            <p className="text-card-foreground">{`${id}. ${body}`}</p>
            <div>
                <label htmlFor={`yes-${id}`} className="text-card-foreground">
                    Sim
                    <input type="radio" id={`yes-${id}`} name={`answer-${id}`} value={'yes'} className="p-2 mt-4 mx-2"
                        onChange={handleInputChange}
                        checked={selectedAnswer === 'yes'}
                    />
                </label>
            </div>
            <div>
                <label htmlFor={`no-${id}`} className="text-card-foreground">
                    Não
                    <input type="radio" id={`no-${id}`} name={`answer-${id}`} value={'no'} className="p-2 mt-4 mx-2"
                        onChange={handleInputChange}
                        checked={selectedAnswer === 'no'}
                    />
                </label>
            </div>
        </div>
    )
}