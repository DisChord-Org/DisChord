class B extends Externa {
    async m() {
        return 1;
    }

    async n() {
        super.m();
    }
}
