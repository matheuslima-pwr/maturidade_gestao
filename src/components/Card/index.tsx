export default function Card() {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 max-w-lg mx-4">
            <h1 className="text-2xl text-[#004477] font-bold"></h1>
            <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices, ex nec ultricies tincidunt, nunc est tincidunt purus, nec fermentum metus mi in nunc.</p>
            <label htmlFor="yes" className="text-black mx-1">Sim</label>
            <input type="radio" id="yes" name="answer" value={'yes'} className="bg-[#004477] text-white rounded-md p-2 mt-4"/>
            <label htmlFor="no" className="text-black mx-1">Não</label>
            <input type="radio" id="no" name="answer" value={'no'} className="bg-[#004477] text-white rounded-md p-2 mt-4"/>
        </div>
    )
}