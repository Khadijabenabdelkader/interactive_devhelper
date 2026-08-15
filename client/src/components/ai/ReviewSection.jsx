export default function ReviewSection({
    title,
    items = []
}) {

    return (
        <div className="bg-slate-900 p-5 rounded-xl">

            <h3 className="text-xl font-bold text-green-400 mb-4">
                {title}
            </h3>

            {items.length === 0 ? (

                <p className="text-slate-400">
                    No issues detected 🎉
                </p>

            ) : (

                <div className="space-y-3">

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className="
                                bg-slate-800
                                border
                                border-slate-700
                                p-4
                                rounded-lg
                            "
                        >

                            {typeof item === "string" ? (

                                <p className="text-slate-300">
                                    {item}
                                </p>

                            ) : (

                                <>

                                    {item.type && (
                                        <p className="
                                            font-semibold
                                            text-cyan-400
                                            mb-2
                                        ">
                                            {item.type}
                                        </p>
                                    )}

                                    {item.description && (
                                        <p className="
                                            text-slate-300
                                            leading-relaxed
                                        ">
                                            {item.description}
                                        </p>
                                    )}

                                </>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}