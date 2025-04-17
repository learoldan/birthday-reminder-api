export interface Birthday {
    birthdayId: string
    firstName: string
    lastName: string
    birthDay: string
    notes?: string
}

export interface NewBirthday {
    firstName: string
    lastName: string
    birthDay: string
    notes?: string
}

export interface CreateUserProps {
    userId: string
    email: string
    name: string
}
