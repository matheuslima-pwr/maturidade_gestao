interface ICard {
    id: number;
    body: string;
    onChange?: (id: number, answer: string) => void;
}

export default function Card({ id, body, onChange }: ICard) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(id, e.target.value)
    }

    return (
        <div id={`${id}`} className="bg-white rounded-lg shadow-md p-4 max-w-lg">
            <h1 className="text-2xl text-[#004477] font-bold"></h1>
            <p className="text-gray-700">{`${body}`}</p>
            <div>
                <label htmlFor="yes" className="text-black mx-1">Sim</label>
                <input type="radio" id="yes" name={`answer-${id}`} value={'yes'} className="bg-[#004477] text-white rounded-md p-2 mt-4"
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label htmlFor="no" className="text-black mx-1">Não</label>
                <input type="radio" id="no" name={`answer-${id}`} value={'no'} className="bg-[#004477] text-white rounded-md p-2 mt-4"
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}