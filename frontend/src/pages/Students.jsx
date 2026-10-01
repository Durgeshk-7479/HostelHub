import { useEffect, useState } from "react";

function Students() {

    const [students, setStudents] = useState([]);

    useEffect(() => {

        const fetchStudents = async () => {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/students",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                setStudents(data);
            }
        };

        fetchStudents();

    }, []);

    return (
        <div>
            <h1>Students</h1>

            {students.map((student) => (
                <p key={student._id}>
                    {student.name} - {student.roomNumber}
                </p>
            ))}
        </div>
    );
}

export default Students;