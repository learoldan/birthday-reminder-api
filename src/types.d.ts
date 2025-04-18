export interface Birthday {
    birthdayId: string
    firstName: string
    lastName: string
    birthDay: string
    notes?: string
}

export interface NewBirthday {
    userId: string
    firstName: string
    lastName: string
    birthDay: string
    notes?: string
}

export interface UpdateBirthday {
    userId: string
    birthdayId: string
    firstName?: string
    lastName?: string
    birthDay?: string
    notes?: string
}

export interface CreateUserProps {
    userId: string
    email: string
    name: string
}

export interface NewBirthdayProps {
    newBirthDay: NewBirthday
}

export interface UpdateBirthdayProps {
    updateBirthDay: UpdateBirthday
}

export interface DeleteBirthdayProps {
    userId: string
    birthdayId: string
}
