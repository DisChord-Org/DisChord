class A {
    async a() {
        return 1;
    }

    async b() {
        await this.a();
    }
}
